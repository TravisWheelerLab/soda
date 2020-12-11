import subprocess
import os
import shutil
import xml.etree.ElementTree as ET

goldfiles_dir = '../goldfiles/'
comparefiles_dir = '../tmp/'
failed = False

def main():
    getComparefiles()
    dirlist = os.listdir(goldfiles_dir)
    goldfiles = [os.path.join(goldfiles_dir, f) for f in dirlist if os.path.isfile(os.path.join(goldfiles_dir, f))]
    comparefiles = [os.path.join(comparefiles_dir, f) for f in dirlist if os.path.isfile(os.path.join(goldfiles_dir, f))]

    for g, c in zip(goldfiles, comparefiles):
        compare(g, c)

    clean()
    if failed:
        raise Exception('test failed')

def compare(goldfile_path, comparefile_path):
    global failed
    gold_tree = ET.parse(goldfile_path).getroot()
    compare_tree = ET.parse(comparefile_path).getroot()

    gold_ann = {child.get('class'): child for child in gold_tree}
    compare_ann = {child.get('class'): child for child in compare_tree}

    for ann in gold_ann:
        g = gold_ann[ann]
        c = compare_ann[ann]
        for k1 in g.keys():
            g_attr = g.get(k1)
            c_attr = c.get(k1)
            if not g_attr == c_attr:
                failed = True
                print('failure at {}: {}'.format(ann, k1))

def getComparefiles():
    if not os.path.isdir(comparefiles_dir):
        os.mkdir(comparefiles_dir)
    cmd = ['npx', 'tsc', 'generate-comparefiles.ts']
    subprocess.run(cmd)
    cmd = ['node', 'generate-comparefiles.js']
    subprocess.run(cmd)

def clean():
    shutil.rmtree(comparefiles_dir)

main()
