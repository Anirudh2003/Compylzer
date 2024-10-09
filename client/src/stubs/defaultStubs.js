const stubs = {};

stubs.py = `
from time import sleep

for i in range(5):
    sleep(i)
    print(i)
`;

export default stubs;