#!/usr/bin/python

import argparse
from numpy import *
import pandas as pd
import re

# convert string to boolean for command line arguments
def logSub(base, v):
    if base == '2':
        return log2(v)
    elif base == '10':
        return log10(v)
    elif base == 'e':
        return log(v)
    else:
        return log(v) / log(int(base))

# parse the command line arguments
parser = argparse.ArgumentParser(
    description='Calculate fold change between CRISPR control and replicates'
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
    '--log',
    default = '2',
    nargs = '?',
    help = 'the log base to use',
)
args = parser.parse_args()

#-- Read file
readCounts = pd.read_table(args.filename, sep = '\t', index_col = 0)
numGuides, numColumns = readCounts.shape

#-- Get columns names, samples will be from index 1 onwards
columns = list(readCounts.columns.values)
controlColumns = [x for x in columns if re.search('^C', x)]
replicateColumns = [x for x in columns if re.search('^R', x)]

#-- Calculate fold change
readCounts = readCounts
for i in range(len(replicateColumns)):
    readCounts[replicateColumns[i]] = logSub(args.log, readCounts[replicateColumns[i]] / readCounts[controlColumns[i]])
    del readCounts[controlColumns[i]]

#-- export filtered dataframe
outfile = args.path + 'foldchange_' + args.filename
readCounts.to_csv(outfile, index_label = 'SEQID', sep = '\t')
