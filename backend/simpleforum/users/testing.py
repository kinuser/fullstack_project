import time
from hashlib import sha256
from random import randint
import base64
import datetime

# print(sha256(str(int(time.time()) + randint(0, 10)).encode('utf-8')).hexdigest())



my_dict = { 'exp': '21.11.2023', "username": "someuser"}

# print(type(str(my_dict)))

initial_string = str(my_dict)
b_initial_string = initial_string.encode('utf-8')

bs_string = base64.b64encode(b_initial_string).hex()
fromhex_string = bytes.fromhex(bs_string)
decoded_string = base64.b64decode(fromhex_string).decode('utf-8')
# print(decoded_string)

print(datetime.datetime.now() + datetime.timedelta(days=10))
cdate = datetime.datetime.now()
cdate.strftime("%d/%m/%y %h:%m:%s")
print(cdate.strftime("%d/%m/%Y %H:%M:%S"))