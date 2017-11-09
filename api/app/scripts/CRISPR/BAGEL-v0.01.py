#!/usr/bin/python

# 0.91 was the version James Knight received, this version below reflects his changes
VERSION = 0.01

#---------------------------------
# BAGEL:  Bayesian Analysis of Gene EssentaLity
# (c) Traver Hart, 02/2015.
# modified 9/2015
# Free to modify and redistribute with attribtuion
#---------------------------------

import argparse
from numpy import *
import scipy.stats as stats
import sys, getopt

def splitColumns(v):
    return v.split(',')

# parse the command line arguments
parser = argparse.ArgumentParser(
    description=(
        'From the Bayesian Analysis of Gene EssentiaLity (BAGEL) suite, '
        'version ' + str(VERSION) + '. '
        'Calculates a log2 Bayes Factor for each gene; positive BFs indicate confidence that the gene is essential. '
        'Writes to [output file]: gene name, mean Bayes Factor across all iterations, std deviation of BFs, and number of iterations '
        'in which the gene was part of the test set (and a BF was calculated[output file]).'
    )
)
required = parser.add_argument_group('required arguments')
optional = parser.add_argument_group('optional arguments')
required.add_argument(
    '--filename',
    help = 'The foldchange file to use',
    required = True
)
required.add_argument(
    '--path',
    help = 'Path to write file',
    required = True
)
required.add_argument(
    '--essential',
    help = 'File with list of training set of essential genes',
    required = True
)
required.add_argument(
    '--nonessential',
    help = 'File with list of training set of nonessential genes',
    required = True
)
required.add_argument(
    '--columns',
    help = 'Comma-delimited list of columns in input file to include in analyisis',
    required = True,
    type = splitColumns
)
optional.add_argument(
    '--numiter',
    default = '1000',
    nargs = '?',
    help = 'Number of bootstrap iterations',
    type = int
)
args = parser.parse_args()

column_list = [int(c) for c in args.columns]

FC_THRESH = 2**-7
genes={}
fc = {}

def round_to_hundredth(x):
	return round( x*100) / 100.0

def bootstrap_resample(X, n=None):
	""" Bootstrap resample an array_like
	Parameters
	----------
	X : array_like
	  data to resample
	n : int, optional
	  length of resampled array, equal to len(X) if n==None
	Results
	-------
	returns X_resamples

	adapted from
	Dated 7 Oct 2013
	http://nbviewer.ipython.org/gist/aflaxman/6871948
	"""
	if n == None:
			n = len(X)

	resample_i = floor(random.rand(n)*len(X)).astype(int)
	X_resample = X[resample_i]
	return X_resample


#
# LOAD FOLDCHANGES
#


fin  = open(args.filename)
skipfields = fin.readline().rstrip().split('\t')
for i in column_list:
	print "Using column:  " + skipfields[i+1]
for line in fin:
	fields = line.rstrip().split('\t')
	gsym = fields[1]
	genes[ gsym ]=1
	if ( not gsym in fc ):
		fc[gsym]=[]    # initialize dict entry as a list
	for i in column_list:
		fc[gsym].append( float(fields[i + 1]))		# per user docs, GENE is column 0, first data column is col 1.
genes_array = array( genes.keys() )
gene_idx = arange( len( genes ) )
#print "Number of gRNA loaded:  " + str( len(genes_array) )
print "Number of unique genes:  " + str( len(genes) )

#
# DEFINE REFERENCE SETS
#
coreEss = []
fin = open(args.essential)
for line in fin:
	coreEss.append( line.rstrip().split('\t')[0] )
fin.close()
coreEss=array(coreEss)
print "Number of reference essentials: " + str(len(coreEss))

nonEss = []
fin = open(args.nonessential)
for line in fin:
	nonEss.append( line.rstrip().split('\t')[0] )
fin.close()
nonEss = array(nonEss)
print "Number of reference nonessentials: " + str(len(nonEss))

#
# INITIALIZE BFS
#
bf = {}
for g in genes_array:
	bf[g]=[]

#
# BOOTSTRAP ITERATIONS
#
for loop in range(args.numiter):
	#
	# bootstrap resample from gene list to get the training set
	#
	gene_train_idx = bootstrap_resample(gene_idx)
	#
	# test set for this iteration is everything not selected in bootstrap resampled training set
	#
	gene_test_idx = setxor1d(gene_idx, gene_train_idx)
	#
	# define essential and nonessential training sets:  arrays of indexes
	#
	train_ess = where( in1d( genes_array[gene_train_idx], coreEss))[0]
	train_non = where( in1d( genes_array[gene_train_idx], nonEss))[0]
	sys.stdout.flush()
	#
	# define ess_train: vector of observed fold changes of essential genes in training set
	#
	ess_train_fc_list_of_lists = [ fc[x] for x in genes_array[gene_train_idx[train_ess]] ]
	ess_train_fc_flat_list = [obs for sublist in ess_train_fc_list_of_lists for obs in sublist]
	#
	# define non_train vector of observed fold changes of nonessential genes in training set
	#
	non_train_fc_list_of_lists = [ fc[x] for x in genes_array[gene_train_idx[train_non]] ]
	non_train_fc_flat_list = [obs for sublist in non_train_fc_list_of_lists for obs in sublist]
	#
	# calculate empirical fold change distributions for both
	#
	kess = stats.gaussian_kde( ess_train_fc_flat_list )
	knon = stats.gaussian_kde( non_train_fc_flat_list )
	#
	# define empirical upper and lower bounds within which to calculate BF = f(fold change)
	#
	x = arange(-10,2,0.01)
	nonfitx = knon.evaluate(x)
	# define lower bound empirical fold change threshold:  minimum FC where knon is above threshold
	f = where( nonfitx > FC_THRESH)
	xmin = round_to_hundredth( min(x[f]) )
	# define upper bound empirical fold change threshold:  minimum value of log2(ess/non)
	subx = arange( xmin, max(x[f]), 0.01)
	logratio_sample = log2( kess.evaluate(subx) / knon.evaluate(subx) )
	f = where( logratio_sample == logratio_sample.min() )
	xmax = round_to_hundredth( subx[f] )
	#
	# round foldchanges to nearest 0.01
	# precalculate logratios and build lookup table (for speed)
	#
	logratio_lookup = {}
	for i in arange(xmin, xmax+0.01, 0.01):
		logratio_lookup[round(i*100)] = log2( kess.evaluate(i) / knon.evaluate(i) )
	#
	# calculate BFs from lookup table for withheld test set
	#
	for g in genes_array[gene_test_idx]:
		foldchanges = array( fc[g] )
		foldchanges[foldchanges<xmin]=xmin
		foldchanges[foldchanges>xmax]=xmax
		bayes_factor = sum( [ logratio_lookup[ round( x * 100 ) ] for x in foldchanges ] )
		bf[g].append(bayes_factor)


outfile = args.path + 'bagel-results_' + args.filename
fout = open(outfile, 'w')
fout.write('GENE\tBF\tSTD\tNumObs\n')
for g in sorted( bf.keys() ):
	num_obs = len( bf[g] )
	bf_mean = mean( bf[g] )
	bf_std  = std( bf[g] )
	bf_norm = ( bf[g] - bf_mean ) / bf_std
	#dstat, pval = stats.kstest( bf_norm, 'norm')
	fout.write('{0:s}\t{1:4.3f}\t{2:4.3f}\t{3:d}\n'.format( g, bf_mean, bf_std, num_obs ) )
fout.close()
