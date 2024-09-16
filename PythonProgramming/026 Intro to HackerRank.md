# Intro to HackerRank Contest



## Submit your HackerRank UserName at form below

[From URL](https://forms.office.com/r/Xz7HjUeZfi)


## Solution to problem 2

[Contest URL](https://www.hackerrank.com/upes-mca-sem1-python-programing-mid-sem)

```python
#!/bin/python3

import math
import os
import random
import re
import sys

#
# Complete the 'generate_email_list' function below.
#
# The function is expected to return a STRING.
# The function accepts STRING sapid as parameter.
#

def generate_email_list(sapid):
    res = [ f"{id}@stu.upes.ac.in" for id in sapid ]
    # print(res)
    return res

if __name__ == '__main__':
    fptr = open(os.environ['OUTPUT_PATH'], 'w')

    
    

    sapid = input()
    print(f"Input received {sapid} type is { type(sapid)}")
    sapid = sapid[1:-1].split(",")
    print(f"modified Input received {sapid} type is { type(sapid)}")

    
    
    email_list = str(generate_email_list(sapid))

    print(email_list)
    
    
    
    fptr.write(email_list + '\n')

    fptr.close()
```