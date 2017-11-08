import argparse

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
optional.add_argument(
    '--minReadCount',
    default=30,
    nargs='?',
    help='Minimum read count required per guide',
    type=int
)
optional.add_argument(
    '--minGuides',
    default=4,
    nargs='?',
    help='Minimum number of guides per gene that must pass the read count cutoff',
    type=int
)
optional.add_argument(
    '--norm',
    default=True,
    nargs='?',
    help='Apply normalization',
    type=str2bool,
)
optional.add_argument(
    '--normCount',
    default=10000000,
    nargs='?',
    help='Normalize each sample to this value',
    type=int
)
args = parser.parse_args()

print args.minReadCount
