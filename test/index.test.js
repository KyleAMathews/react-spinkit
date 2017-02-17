import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Spinner from '../src/index.jsx';

describe('<Spinner />', () => {
	it('should render double-bounce spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="double-bounce" />);

		expect(wrapper.find('div.sk-double-bounce').length).to.equal(1);
		expect(wrapper.find('div.sk-double-bounce1').length).to.equal(1);
		expect(wrapper.find('div.sk-double-bounce2').length).to.equal(1);
	});

	it('should not apply `fade-in` class', () => {
		const wrapper = shallow(<Spinner spinnerName="sk-double-bounce" noFadeIn/>);

		expect(wrapper.find('div.fade-in').length).to.equal(0);
	});

	it('should override `spinner` className', () => {
		const wrapper = shallow(
			<Spinner
				spinnerName="sk-double-bounce"
				overrideSpinnerClassName="sk-custom-spinner"
			/>
		);

		expect(wrapper.find('div.sk-spinner').length).to.equal(0);
		expect(wrapper.find('div.sk-custom-spinner').length).to.equal(1);
	});

	it('should render rotating-plane spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="rotating-plane" />);

		expect(wrapper.find('div.sk-rotating-plane').length).to.equal(1);
	});

	it('should render wave spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="wave" />);

		expect(wrapper.find('div.sk-wave').length).to.equal(1);
		expect(wrapper.find('div.sk-rect1').length).to.equal(1);
		expect(wrapper.find('div.sk-rect2').length).to.equal(1);
		expect(wrapper.find('div.sk-rect3').length).to.equal(1);
		expect(wrapper.find('div.sk-rect4').length).to.equal(1);
		expect(wrapper.find('div.sk-rect5').length).to.equal(1);
	});

	it('should render wandering-cubes spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="wandering-cubes" />);

		expect(wrapper.find('div.sk-wandering-cubes').length).to.equal(1);
		expect(wrapper.find('div.sk-cube1').length).to.equal(1);
		expect(wrapper.find('div.sk-cube2').length).to.equal(1);
	});

	it('should render pulse spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="pulse" />);

		expect(wrapper.find('div.sk-pulse').length).to.equal(1);
	});

	it('should render chasing-dots spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="chasing-dots" />);

		expect(wrapper.find('div.sk-chasing-dots').length).to.equal(1);
		expect(wrapper.find('div.sk-dot1').length).to.equal(1);
		expect(wrapper.find('div.sk-dot2').length).to.equal(1);
	});

	it('should render circle spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="circle" />);

		expect(wrapper.find('div.sk-circle-wrapper').length).to.equal(1);
		expect(wrapper.find('div.sk-circle').length).to.equal(12);
	});

	it('should render cube-grid spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="cube-grid" />);

		expect(wrapper.find('div.sk-cube-grid').length).to.equal(1);
		expect(wrapper.find('div.sk-cube').length).to.equal(9);
	});

	it('should render folding-cube spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="folding-cube" />);

		expect(wrapper.find('div.sk-folding-cube').length).to.equal(1);
		expect(wrapper.find('div.sk-cube').length).to.equal(4);
	});

	it('should render wordpress spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="wordpress" />);

		expect(wrapper.find('div.sk-wordpress').length).to.equal(1);
		expect(wrapper.find('div.sk-inner-circle').length).to.equal(1);
	});

	it('should render three-bounce spinner', () => {
		const wrapper = shallow(<Spinner spinnerName="three-bounce" />);

		expect(wrapper.find('div.sk-three-bounce').length).to.equal(1);
		expect(wrapper.find('div.sk-bounce1').length).to.equal(1);
		expect(wrapper.find('div.sk-bounce2').length).to.equal(1);
		expect(wrapper.find('div.sk-bounce3').length).to.equal(1);
	});
});
