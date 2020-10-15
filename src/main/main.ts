import xml2js from 'xml2js';
import fs from 'fs';
import { Yolo } from '../model/yolo.interface';


export class Main {

    private sourceBase: string = "./src/base/annotations/";
    private destinationBase: string = "./src/result/labels/"

    constructor() {
        const files: string[] = fs.readdirSync(this.sourceBase);

        for (let i = 0; i < files.length; i++) {
            console.log("read and parse the annotation " + files[i]);
            const xml_file: string = fs.readFileSync(this.sourceBase + files[i], 'utf8');
            this.parsePascalToYolo(files[i].split('.')[0], xml_file);
        }
    }

    /**
    * Parse a pascal voc xml and create a yolo label txt
    * @param file_name name of the xml file
    * @param yolo_objects read xml file data
    */
    private parsePascalToYolo(file_name: string, xml_file: string): void {
        xml2js.parseString(xml_file, (err, result) => {

            // image height and width
            const height: number = parseFloat(result['annotations']['size'][0]['height'][0]);
            const width: number = parseFloat(result['annotations']['size'][0]['width'][0]);

            // get bounding box object data
            let objects: Yolo[] = [];

            if (result['annotations']['object']) {
                result['annotations']['object'].forEach((object: any) => {
                    objects.push({
                        name: object['name'],
                        x_center: this.getCenterAxis(parseFloat(object['bndbox'][0]['xmin'][0]), parseFloat(object['bndbox'][0]['xmax'][0])) / width,
                        y_center: this.getCenterAxis(parseFloat(object['bndbox'][0]['ymin'][0]), parseFloat(object['bndbox'][0]['ymax'][0])) / height,
                        n_width: this.getObjectLength(parseFloat(object['bndbox'][0]['xmin'][0]), parseFloat(object['bndbox'][0]['xmax'][0])) / width,
                        n_height: this.getObjectLength(parseFloat(object['bndbox'][0]['ymin'][0]), parseFloat(object['bndbox'][0]['ymax'][0])) / height,
                    })
                });
            }

            this.saveYoloFormat(file_name, objects);
        });
    }

    /**
    * Create an image label.txt
    * @param file_name name of the image for the label file name
    * @param yolo_objects list of objects that were classified
    */
    private saveYoloFormat(file_name: string, yolo_objects: Yolo[]): void {
        fs.writeFileSync(this.destinationBase + file_name + ".txt", this.parseYoloToString(yolo_objects));
    }

    /**
    * Get the center pixel of the classified object
    * @param min top-left axis
    * @param max bottom-righ axis
    * @returns center coordinate
    */
    private getCenterAxis(min: number, max: number): number {
        return (min + max) / 2;
    }

    /**
    * Get the pixel length of an classified object
    * @param min top-left axis
    * @param max bottom-righ axis
    * @returns center axis
    */
    private getObjectLength(min: number, max: number): number {
        return max > min ? max - min : min - max;
    }

    /**
    * Parse a yolo object list into a string for the label.txt
    * @param objects list of yolo objects
    * @returns object classifier index
    */
    private parseYoloToString(objects: Yolo[]): string {
        let value = "";
        objects.forEach((yolo: Yolo) => {
            value += this.resolveObjectName(yolo.name) + " " + yolo.x_center + " " + yolo.y_center + " " + yolo.n_width + " " + yolo.n_height + "\n";
        });
        return value;
    }

    /**
    * Get the index of the object classifier from the names.txt
    * @param name name of the classifier
    * @returns object classifier index
    */
    private resolveObjectName(name: string): number {
        const result = fs.readFileSync("./src/base/names.txt", "utf-8");
        const index: number = result.split("\n").findIndex(v => name == v);
        return index ? index : 0;
    }



}