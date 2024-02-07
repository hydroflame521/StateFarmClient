import os
import datetime
import time
import json
import glob
import requests
import re


def get_shellshockjs_main():
    url = "https://shellshock.io/js/shellshock.js"
    r = requests.get(url)
    try:
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print("FAILURE IN FETCHING SHELLSHOCK.JS")
        print(e)
        print("RETRYING IN 5 SECONDS")
        time.sleep(5)
        return get_shellshockjs_main()
    return r.text

def parse_regexes():
    data = {}
    found_files = []
    js = get_shellshockjs_main()
    for file in glob.glob("regexes/*"):
        with open(file, "r") as fileh:
            lines = map(str.strip, fileh.readlines())
            for line in lines:
                if file in found_files:
                    continue
                line_as_regex = re.compile(line)
                matches_in_shellshock = line_as_regex.findall(js)
                if len(matches_in_shellshock) > 0:
                    d = {"%s" % file: matches_in_shellshock[0]}
                    data.update(d)
                    found_files.append(file)
    return json.dumps(data)

def sync_remote():
    os.system("git add VARIABLE_NAMES && git commit -m 'update regexes @ %s' && git push origin main" % datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

def main():
    with open("VARIABLE_NAMES", "w") as fileh:
        fileh.write(parse_regexes())
    sync_remote()

