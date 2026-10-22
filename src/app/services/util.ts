export function isEmpty<T>(value:T): boolean {
    if (typeof value === 'string' && value.trim() === '') return true;

    if (value === null || value === undefined)return true;

    return false;
}

export function isMobile(): boolean {
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return true;
    }

    return false;
}

export function wait(millisecondes: number): Promise<number> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, millisecondes * 1000);
    });
}

export function clone(data: object|Array<any>): object|Array<any> {
    return JSON.parse(JSON.stringify(data));
}

export function removeTags(str:string): string {
    if ((str === null) || (str === ''))return "";
    else str = str.toString();

    return str.replace( /(<([^>]+)>)/ig, '');
}

export function readFile(file: File): Promise<any> {
    return new Promise((resolve, err) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        resolve(e);
      };
      reader.readAsDataURL(file);
    });
}

export function getImageFileFromUrl(url:string, filename:string = 'image.png'): Promise<File> {
    return new Promise((resolve, reject) => {
        // fetch(url)
        // .then(res => res.blob())
        // .then(blob => {
        //     console.log(blob)
        //     resolve(new File([blob], filename, {type: 'image/png'}));
        // });
        var image = new Image();
         image.crossOrigin = 'Anonymous';
         image.onload = () => {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.height = image.height;
            canvas.width = image.width;
            context?.drawImage(image, 0, 0);
            var dataURL = canvas.toDataURL('image/jpeg');
            console.log(dataURL);
         };
         image.src = url;
    });
}

export function capitalizeFirstLetter(str:string):string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * fieldType: 1-number, 2-string, 3-date
 */
export function sortArray(tab: Array<any>, field: string, way: number, fieldType:number): Array<any> {
    if (fieldType === 1) {
        tab.sort((a: any, b: any) => {
            if (way == 1) return parseFloat(a[field]) - parseFloat(b[field]);
            else return parseFloat(b[field]) - parseFloat(a[field]);
        });
    }

    if (fieldType === 2) {
        tab.sort((a: any, b: any) => {
            if (way == 1) return a[field].toString().localeCompare(b[field].toString());
            else return b[field].toString().localeCompare(a[field].toString());
        });
    }

    return tab;
}
