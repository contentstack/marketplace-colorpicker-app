/* Import React modules */
import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";
/* Import other node modules */
import { InstructionText } from "@contentstack/venus-components";
import ContentstackAppSdk from "@contentstack/app-sdk";
/* Import our modules */
import localeTexts from "../../common/locale/en-us";
import { TypeSDKData, ColorPickerData } from "../../common/types";
/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";
import useJsErrorTracker from "../../hooks/useJsErrorTracker";
import { useAppSdk } from "../../hooks/useAppSdk";
import useAnalytics from "../../hooks/useAnalytics";


const CustomField: React.FC = function () {

	const { addMetadata, trackError } = useJsErrorTracker();
  	const { trackEvent } = useAnalytics();
  	const [appSdk] = useAppSdk();

	const [state, setState] = useState<TypeSDKData>({
		config: {},
		location: {},
		appSdkInitialized: false,
	});

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
		trackEvent('toggle picker is visible')
		setColor((prev) => ({
			showPicker: !prev.showPicker,
			pickerColor: prev.pickerColor,
		}));
	};

	const closePicker = () => {
		trackEvent('Color picker closed')
		setColor((prev) => ({
			showPicker: false,
			pickerColor: prev.pickerColor,
		}));
	};

	const pickerColorChanged = (colour: any) => {
		trackEvent('color changed')
		setColor((prev) => ({
			showPicker: prev.showPicker,
			pickerColor: colour.rgb,
		}));
		state.location?.CustomField?.field?.setData(colour);
	};

	useEffect(() => {
		ContentstackAppSdk.init().then(async (appSdk) => {
			const config = await appSdk?.getConfig();

			setState({
				config,
				location: appSdk.location,
				appSdkInitialized: true,
			});

			appSdk.location.CustomField?.frame?.updateHeight?.(300);

			const initialData = appSdk.location?.CustomField?.field?.getData();
			
			addMetadata("stack", `${appSdk?.stack._data.name}`);
          	addMetadata("organization", `${appSdk?.currentUser.defaultOrganization}`);
          	addMetadata("api_key", `${stackKey}`);
          	addMetadata("user_uid", `${appSdk?.stack._data.collaborators[0].uid}`);

			if (initialData?.rgb) {
				setColor({
					showPicker: false,
					pickerColor: initialData.rgb,
				});
			}
		});
	}, []);

	return (
		<div className="layout-container">
			{state.appSdkInitialized && (
				<div>
					<InstructionText testId="color-picker-text">
						{localeTexts.customField.instruction}
					</InstructionText>
					<div>
						<div
							className="swatch"
							role="none"
							onClick={togglePickerVisibility}
							onKeyDown={togglePickerVisibility}
						>
							<div style={styles.color} />
						</div>
						{stateColor.showPicker ? (
							<div className="popover">
								<div
									className="cover"
									role="presentation"
									onClick={closePicker}
									onKeyDown={closePicker}
								/>
								<SketchPicker
									color={stateColor.pickerColor}
									onChange={pickerColorChanged}
								/>
							</div>
						) : null}
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomField;
