/**
 * Types of DC motor control
 */
enum DCmotion {
	//% block= 正転
	Forward,
	//% block= 逆転
	Backward,
	//% block= 停止
	Brake,
	//% block= 解放
	Coast
}

enum connectorDCMotor {
	//% block= M1
	M1,
	//% block= M2
	M2
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
//% color=190 weight=100 icon="\uf009" block="ArtecRobo"
namespace artecrobo {

	/* spped initial value */
	let speedM1 = 1023;
	let speedM2 = 1023;
	let state = DCmotion.Brake;
	// Move DC motor
	//% blockId=artec_move_dc_motor
	//% block="DCモーター %connector|を %motion|にする"
	export function moveDCMotor(connector: connectorDCMotor, motion: DCmotion): void {
		switch(motion) {
			case DCmotion.Forward:
				/*
					Move Forward
					M1:P8 = speed, P12 = 0
					M2:P0 = speed, P16 = 0
				*/
				if (connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P8, 1);
					pins.analogWritePin(AnalogPin.P12, speedM1);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 1);
					pins.analogWritePin(AnalogPin.P16, speedM2);
				}
				break;
			case DCmotion.Backward:
				/*
					Move Backward
					M1:P8 = 0, P12 = speeed
					M2:P0 = 0, P16 = speeed
				*/
				if (connector == connectorDCMotor.M1) {
					pins.analogWritePin(AnalogPin.P8, speedM1);
					pins.digitalWritePin(DigitalPin.P12, 1);
				} else {
					pins.analogWritePin(AnalogPin.P0, speedM2);
					pins.digitalWritePin(DigitalPin.P16, 1);
				}
				break;
			case DCmotion.Brake:
				/*
					Brake
					M1:P8 = 1, P12 = 1
					M2:P0 = 1, P16 = 1
				*/
				if (connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P8, 1);
					pins.digitalWritePin(DigitalPin.P12, 1);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 1);
					pins.digitalWritePin(DigitalPin.P16, 1);
				}
				break;
			case DCmotion.Coast:
				/*
					Coast
					M1:P8 = 0, P12 = 0
					M2:P0 = 0, P16 = 0
				*/
				if (connector == connectorDCMotor.M1) {
					pins.digitalWritePin(DigitalPin.P8, 0);
					pins.digitalWritePin(DigitalPin.P12, 0);
				} else {
					pins.digitalWritePin(DigitalPin.P0, 0);
					pins.digitalWritePin(DigitalPin.P16, 0);
				}
				break;
		}
		state = motion;
	}

	//% blockId=artec_set_speed_dc_motor
	//% block="DCモーター %connector|の速さを %speed|にする"
	// speed.min=0 speed.max= 1023
	export function setSpeedDCMotor(connector: connectorDCMotor, speed: number): void {
		if (connector == connectorDCMotor.M1) {
			speedM1 = 1023 - speed;
		} else {
			speedM2 = 1023 - speed;
		}
		if (state == DCmotion.Forward || state == DCmotion.Backward) {
			moveDCMotor(connector, state);
		}
	}

	// Sync servo motor
	// export function moveServoMotorSync(string: pin, int: speed): void {
	// 	digitalWritePin(name: DigitalPin, value: number);
	// }
}
