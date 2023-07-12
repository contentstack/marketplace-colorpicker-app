export interface KeyValueObj {
  [key: string]: string;
}

export interface TypeSDKData {
  config: any;
  location: any;
  appSdkInitialized: boolean;
}

export interface ColorPickerData {
  showPicker: boolean;
  pickerColor: {
    r: any;
    g: any;
    b: any;
    a: any;
  };
}
