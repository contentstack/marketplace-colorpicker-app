import { test, expect } from '@playwright/test';
import { colorPickerApp } from '../pages/colorpickerpage';

test.describe(" Color picker App at entry", () => {
  let colorpickerapp;
  test.use({ storageState: "storageState.json" });
  
  test('Should Apply all the Json app tests', async ({page}) => {
    colorpickerapp = new colorPickerApp(page);
    await colorpickerapp.openColorApp()
    await colorpickerapp.changeColorbyDraging();
    await colorpickerapp.changeSaturation();
    await colorpickerapp.changeHexColor();
    await colorpickerapp.changeBasicColor();
  });

});
