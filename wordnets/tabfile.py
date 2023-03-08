__author__ = "Nathan Royer"
__copyright__ = "Copyright 2021, The GETALP Team"
__license__ = "GPL"
__version__ = "1.0.0"
__maintainer__ = "Nathan Royer"
__email__ = "nathan.royer.pro@gmail.com"
__status__ = "Production"

# Calls `callback` for each line in the file,
# which doesn't begin with a hash. `callback`
# is called with the tab-separated parts as 
# second argument and an arbitrary argument
# as first. The value of this arbitrary 
# argument is the one provided in the `arg`
# argument to the `parse` function.
def parse(path, callback, arg):
	file_handle = open(path, 'r')
	lines = 0
	for line in file_handle:
		if line[0] == '#': continue
		if line[-1] == '\n': line = line[:-1]
		parts = line.split('\t')
		callback(arg, parts)
		lines += 1
	file_handle.close()
	return lines
