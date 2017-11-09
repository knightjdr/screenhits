#!/usr/bin/python

import argparse
from numpy import *
import pandas as pd
import re

# convert string to boolean for command line arguments
def str2bool(v):
    if v.lower() in ('true', 't', '1'):
        return True
    elif v.lower() in ('false', 'f','0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')

# parse the command line arguments
parser = argparse.ArgumentParser(
    description='Filter and normalize CRISPR samples.'
)
required = parser.add_argument_group('required arguments')
optional = parser.add_argument_group('optional arguments')
required.add_argument(
    '--filename',
    help = 'The file to use',
    required = True
)
required.add_argument(
    '--path',
    help = 'Path to write file',
    required = True
)
optional.add_argument(
    '--minReadCount',
    default = 30,
    nargs = '?',
    help = 'Minimum read count required per guide',
    type = int
)
optional.add_argument(
    '--minGuides',
    default = 4,
    nargs = '?',
    help = 'Minimum number of guides per gene that must pass the read count cutoff',
    type = int
)
optional.add_argument(
    '--norm',
    default = True,
    nargs = '?',
    help = 'Apply normalization',
    type = str2bool,
)
optional.add_argument(
    '--normCount',
    default = 10000000,
    nargs = '?',
    help = 'Normalize each sample to this value',
    type = int
)
args = parser.parse_args()

#-- Read file
readCounts = pd.read_table(args.path + args.filename, sep = '\t', index_col = 0)
numGuides, numColumns = readCounts.shape

#-- Get columns names, samples will be from index 1 onwards
columns = list(readCounts.columns.values)
controlColumns = [x for x in columns if re.search('^C', x)]
replicateColumns = [x for x in columns if re.search('^R', x)]

#-- normalize columns
if args.norm:
    sumReads = readCounts.iloc[:, range(1, numColumns)].sum(0)
    normalized = pd.DataFrame(index = readCounts.index.values)
    normalized['GENE'] = readCounts.iloc[:, 0]
    normalized[columns[1:numColumns]] = readCounts.iloc[:, range(1, numColumns)] / tile(sumReads, [numGuides, 1]) * args.normCount

#-- filter for miminum read count across controls
filtered = normalized[(normalized.T >= args.minReadCount).all()]

#-- filter genes without minimum number of guides
geneCounts = filtered['GENE'].value_counts()
keepGenes = geneCounts.loc[geneCounts >= args.minGuides].index.tolist()
filtered = filtered[filtered['GENE'].isin(keepGenes)]

#-- export filtered dataframe
outfile = args.path + 'filtered_' + args.filename
filtered.to_csv(outfile, index_label = 'SEQID', sep = '\t')
