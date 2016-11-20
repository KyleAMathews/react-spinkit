import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Spinner from '../src/index.jsx';

describe('<Spinner />', () => {
	it('should render double-bounce spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="double-bounce" />);

		expect(wrapper.find('div.double-bounce').length).to.equal(1);
		expect(wrapper.find('div.double-bounce1').length).to.equal(1);
		expect(wrapper.find('div.double-bounce2').length).to.equal(1);
	});

	it('should not apply `fade-in` class', () => {
		const wrapper = shallow(<Spinner spinnerName="double-bounce" noFadeIn/>);

		expect(wrapper.find('div.fade-in').length).to.equal(0);
	});

	it('should override `spinner` className', () => {
		const wrapper = shallow(
			<Spinner 
				spinnerName="double-bounce" 
				overrideSpinnerClassName="custom-spinner"
			/>
		);
		
		expect(wrapper.find('div.spinner').length).to.equal(0);
		expect(wrapper.find('div.custom-spinner').length).to.equal(1);
	});

	it('should render rotating-plane spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="rotating-plane" />);

		expect(wrapper.find('div.rotating-plane').length).to.equal(1);
	});

	it('should render wave spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="wave" />);

		expect(wrapper.find('div.wave').length).to.equal(1);
		expect(wrapper.find('div.rect1').length).to.equal(1);
		expect(wrapper.find('div.rect2').length).to.equal(1);
		expect(wrapper.find('div.rect3').length).to.equal(1);
		expect(wrapper.find('div.rect4').length).to.equal(1);
		expect(wrapper.find('div.rect5').length).to.equal(1);
	});

	it('should render wandering-cubes spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="wandering-cubes" />);

		expect(wrapper.find('div.wandering-cubes').length).to.equal(1);
		expect(wrapper.find('div.cube1').length).to.equal(1);
		expect(wrapper.find('div.cube2').length).to.equal(1);
	});

	it('should render pulse spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="pulse" />);

		expect(wrapper.find('div.pulse').length).to.equal(1);
	});

	it('should render chasing-dots spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="chasing-dots" />);

		expect(wrapper.find('div.chasing-dots').length).to.equal(1);
		expect(wrapper.find('div.dot1').length).to.equal(1);
		expect(wrapper.find('div.dot2').length).to.equal(1);
	});

	it('should render circle spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="circle" />);

		expect(wrapper.find('div.circle-wrapper').length).to.equal(1);
		expect(wrapper.find('div.circle').length).to.equal(12);
	});

	it('should render cube-grid spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="cube-grid" />);

		expect(wrapper.find('div.cube-grid').length).to.equal(1);
		expect(wrapper.find('div.cube').length).to.equal(9);
	});

	it('should render wordpress spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="wordpress" />);

		expect(wrapper.find('div.wordpress').length).to.equal(1);
		expect(wrapper.find('div.inner-circle').length).to.equal(1);
	});

	it('should render three-bounce spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="three-bounce" />);

		expect(wrapper.find('div.three-bounce').length).to.equal(1);
		expect(wrapper.find('div.bounce1').length).to.equal(1);
		expect(wrapper.find('div.bounce2').length).to.equal(1);
		expect(wrapper.find('div.bounce3').length).to.equal(1);
	});
});