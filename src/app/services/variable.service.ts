import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogInfoComponent } from 'src/app/dialogs/dialog-info/dialog-info.component';

interface IResizeImageOptions {
  maxSize: number;
  file: File;
}
const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: Infinity,
  maximumAge: 0
};

@Injectable()
export class VariableService {
  pageSelected!: string;

  constructor(
    private dialog: MatDialog
  ) {
  }

  setPageSelected(val: string) {
    console.log(val);
    this.pageSelected = val;
  }

  getPageSelected() {
    return this.pageSelected;
  }

  resizeImage = (settings: IResizeImageOptions) => {
    const file = settings.file;
    const maxSize = settings.maxSize;
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement('canvas');
    const dataURItoBlob = (dataURI: string) => {
      const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
        atob(dataURI.split(',')[1]) :
        unescape(dataURI.split(',')[1]);
      const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const max = bytes.length;
      const ia = new Uint8Array(max);
      for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
      return new Blob([ia], { type: mime });
    };
    const resize = () => {
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(image, 0, 0, width, height);
      let dataUrl = canvas.toDataURL('image/jpeg');
      return dataUrl;//dataURItoBlob(dataUrl);
    };

    return new Promise((ok, no) => {
      if (!file.type.match(/image.*/)) {
        no(new Error("Not an image"));
        return;
      }

      reader.onload = (readerEvent: any) => {
        image.onload = () => ok(resize());
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    })
  };

  blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }

  testBrowserLocation() {
    function success(position: any) {
      console.log(position);
    }

    function error() {
      console.log('Unable to retrieve your location');
    }

    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      console.log('Locating…');
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  checkLocationPermissions(showError: boolean): Promise<boolean> {
    var promise = new Promise<boolean>(async (resolve) => {
      try {
        console.log('Checking permissions');
        const geolocationEnabled = await Geolocation.checkPermissions();
        console.log(geolocationEnabled);
        if (geolocationEnabled.location !== 'granted') {
          if (Capacitor.getPlatform() !== 'web') {
            const granted = await Geolocation.requestPermissions();

            if (granted.location !== 'granted') {
              resolve(false);
            } else {
              resolve(true);
            }
          } else {
            //this.testBrowserLocation();
            if (showError) {
              this.showInfo('ERROR', 'Permissinon Error', 'Please enable location on browser', false).then(async showInfoResult => {
                const geolocationEnabledNow = await Geolocation.checkPermissions();
                if (geolocationEnabledNow.location !== 'granted') {
                  resolve(false);
                } else {
                  resolve(true);
                }
              });
            } else {
              resolve(false);
            }
          }
        } else {
          console.log(true);
          resolve(true);
        }
      } catch (exception) {
        console.log(exception);
        resolve(false);
      }
    });
    return promise;
  }

  showInfo(title: string, alertHeading: string, alertContent: string, stopAction: boolean): Promise<boolean> {
    var promise = new Promise<boolean>((resolve) => {
      try {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          title: title,
          alertHeading: alertHeading,
          alertContent: alertContent,
          stopAction: stopAction
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogInfoComponent,
          dialogConfig);

        if (stopAction) {
          resolve(false);
        } else {
          dialogRef.afterClosed().subscribe(result => {
            resolve(result);
          });
        }
      } catch (exception) {
        resolve(false);
      }
    });
    return promise;
  }

  getPosition(): Promise<Position | null> {
    var promise = new Promise<Position | null>(async (resolve) => {
      try {
        const coordinates = await Geolocation.getCurrentPosition(options);
        resolve(coordinates);
      } catch (exception) {
        console.log(exception);
        resolve(null);
      }
    });
    return promise;
  }

  requestPermission(): Promise<string> {
    var promise = new Promise<string>(async (resolve) => {
      try {
        const status = await Geolocation.requestPermissions();
        resolve(status.location);
      } catch (exception) {
        console.log(exception);
        resolve("none");
      }
    });
    return promise;
  }
}