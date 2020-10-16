# PascalVOC2yolo

This tool converts the ``Pascal VOC annotations`` to the ``darknet labels``. 

## How to use it?

1. Install all the npm-packages through ``npm install``
2. Set the object classifiers in ``./src/base/names.txt.`` The set order of the objects determines the index of this object classifier.
Your ``names.txt`` should look like this, for example the object ``shoe`` will have the index 0 in the darknet labels.
```
shoe
dog
cat
...
```
3. Save the Pascal VOC annotation into ``./src/base/annotations``.
4. Run the tool through ``npm run start``, the converted annotations will be saved under ``./src/result/labels/*``

The terminal will display each file that got converted.

![terminal](https://github.com/SerQuicky/pascalVOC2yolo/blob/main/md/terminal.png)
