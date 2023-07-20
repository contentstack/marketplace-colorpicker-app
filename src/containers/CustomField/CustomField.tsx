import { InstructionText } from "@contentstack/venus-components";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";
import { useCustomField } from "../../common/hooks/useCustomField";
import localeTexts from "../../common/locales/en-us";
import { ColorPickerData } from "../../common/types/types";
import "./style.css";

const CustomFieldExtension = () => {
  const [fieldColor, setFieldColor] = useCustomField();

  const [stateColor, setColor] = useState<ColorPickerData>({
    showPicker: false,
    pickerColor: {
      r: "108",
      g: "92",
      b: "231",
      a: "100",
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

  const pickerColorChanged = (colour: any) => {
    setColor((prev) => ({
      showPicker: prev.showPicker,
      pickerColor: colour.rgb,
    }));
    setFieldColor(colour);
  };

  useEffect(() => {
    if (fieldColor && Object.keys(fieldColor).length) {
      setColor((prev) => ({
        showPicker: prev.showPicker,
        pickerColor: fieldColor.rgb,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldColor]);

  return (
    <div className="layout-container">
      <div id="color-picker">
        <InstructionText className="text-left" testId="color-picker-text">
          {localeTexts.customField.instruction}
        </InstructionText>
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
