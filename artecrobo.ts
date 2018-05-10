/**
 * Types of DC motor control
 */
enum DCmotion {
	//% block= Forward
	Forward,
	//% block= Backward
	Backward,
	//% block= Stop
	Brake,
	//% block= Release
	Coast
}

enum connectorDCMotor {
	//% block= M1
	M1,
	//% block= M2
	M2,
}

enum connectorServoMotor {
	//% block= P13
	P13,
	//% block= P14
	P14,
	//% block= P15
	P15
}

/**
 * ArtecRobo control package
 */
//% color=190 weight=100 icon="chess board icon" block="ArtecRobo"
namespace artecrobo {

	/* spped initial value */
	let speedM1 = 0;
	let speedM2 = 0;
	// Move DC motor
	//% blockId=move_dc_motor
	//% block="DCモーターを %connector を %motion にする"
	export function moveDCMotor(connector: connectorDCMotor, motion: DCmotion): void {
		switch(motion) {
			case DCmotion.Forward:
				/*
					Move Forward
					M1:P6 = speed, P12 = 0
					M1:P0 = speed, P16 = 0
				*/
				if (connector == connectorDCMotor.M1) {
					pins.analogWritePin(AnalogPin.P6, speedM1);
					pins.digitalWritePin(DigitalPin.P12, 0);
				} else {
					pins.analogWritePin(AnalogPin.P0, speedM2);
					pins.digitalWritePin(DigitalPin.P16, 0);
				}
				break;
			case DCmotion.Backward:
				/*
					Move Backward
					M1:P6 = 0, P12 = speeed
					M1:P0 = 0, P16 = speeed
				*/
				if (connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P6, 0);
					pins.analogWritePin(AnalogPin.P12, speedM1);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 0);
					pins.analogWritePin(AnalogPin.P16, speedM2);
				}
				break;
			case DCmotion.Brake:
				/*
					Brake
					M1:P6 = 1, P12 = 1
					M1:P0 = 1, P16 = 1
				*/
				if (connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P6, 1);
					pins.digitalWritePin(DigitalPin.P12, 1);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 1);
					pins.digitalWritePin(DigitalPin.P16, 1);
				}
				break;
			case DCmotion.Coast:
				/*
					Coast
					M1:P6 = 0, P12 = 0
					M1:P0 = 0, P16 = 0
				*/
				if (connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P6, 0);
					pins.digitalWritePin(DigitalPin.P12, 0);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 0);
					pins.digitalWritePin(DigitalPin.P16, 0);
				}
				break;
		}
	}

	//% blockId=set_speed_dc_motor
	//% block="DCモーター %connector の速さを %speed にする"
	export function setSpeedDCMotor(connector: connectorDCMotor, speed: number): void {
	}

	// Sync servo motor
	// export function moveServoMotorSync(string: pin, int: speed): void {
	// 	digitalWritePin(name: DigitalPin, value: number);
	// }
}
