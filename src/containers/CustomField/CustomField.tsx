import { useEffect, useState } from "react";
import { SketchPicker, type ColorResult } from "react-color";
import reactCSS from "reactcss";
import { useCustomField } from "../../common/hooks/useCustomField";
import { ColorPickerData } from "../../common/types/types";
import "./style.css";

const CustomFieldExtension = () => {
  const [fieldColor, setFieldColor] = useCustomField();

  const [stateColor, setColor] = useState<ColorPickerData>({
    showPicker: false,
    pickerColor: {
      r: 108,
      g: 92,
      b: 231,
      a: 1,
    },
  });

  const styles = reactCSS({
    default: {
      color: {
        width: "70px",
        height: "30px",
        borderRadius: "4px",
        background: `rgba(${stateColor.pickerColor.r}, ${stateColor.pickerColor.g}, ${stateColor.pickerColor.b}, ${stateColor.pickerColor.a})`,
      },
    },
  });

  const togglePickerVisibility = () => {
    setColor((prev) => ({
      showPicker: !prev.showPicker,
      pickerColor: prev.pickerColor,
    }));
  };

  const closePicker = () => {
    setColor((prev) => ({
      showPicker: false,
      pickerColor: prev.pickerColor,
    }));
  };

  const pickerColorChanged = (colour: ColorResult) => {
    const rgb = colour.rgb;
    setColor((prev) => ({
      showPicker: prev.showPicker,
      pickerColor: {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        a: rgb.a ?? prev.pickerColor.a,
      },
    }));
    setFieldColor(colour);
  };

  useEffect(() => {
    if (fieldColor && typeof fieldColor === "object" && fieldColor !== null && "rgb" in fieldColor) {
      const rgb = (fieldColor as ColorResult).rgb;
      setColor((prev) => ({
        showPicker: prev.showPicker,
        pickerColor: {
          r: rgb.r,
          g: rgb.g,
          b: rgb.b,
          a: rgb.a ?? prev.pickerColor.a,
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldColor]);

  return (
    <div className="layout-container">
      <div id="color-picker">
        <div>
          <div className="swatch" role="none" onClick={togglePickerVisibility} onKeyDown={togglePickerVisibility}>
            <div style={styles.color} />
          </div>
          {stateColor.showPicker ? (
            <div className="popover">
              <div className="cover" role="presentation" onClick={closePicker} onKeyDown={closePicker} />
              <SketchPicker color={stateColor.pickerColor} onChange={pickerColorChanged} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CustomFieldExtension;
