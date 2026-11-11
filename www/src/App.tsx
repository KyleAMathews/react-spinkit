import { useState, type ReactNode } from 'react';
import Spinner from 'react-spinkit';
import { spinkitSpinners, loadersCssSpinners } from 'react-spinkit/dist/spinners';

const spinkitNames = Object.keys(spinkitSpinners) as Spinner.Name[];
const loadersCssNames = Object.keys(loadersCssSpinners) as Spinner.Name[];

const colors = [
  'aqua',
  'blue',
  'coral',
  'fuchsia',
  'goldenrod',
  'green',
  'olive',
  'orange',
  'purple',
  'red',
  'steelblue',
];

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function Example({ code, children }: { code: string; children: ReactNode }) {
  return (
    <div className="example">
      <code>{code}</code>
      {children}
    </div>
  );
}

function SpinnerPreview({ name }: { name: Spinner.Name }) {
  const [color] = useState(randomColor);
  return (
    <div className="example-row">
      <Example code={`<Spinner name="${name}" />`}>
        <Spinner name={name} />
      </Example>
      <Example code={`<Spinner name="${name}" color="${color}" />`}>
        <Spinner name={name} color={color} />
      </Example>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <h1>React-Spinkit</h1>
      <a href="https://github.com/KyleAMathews/react-spinkit">Browse code on GitHub</a>

      <h2>Spinkit Spinners</h2>
      {spinkitNames.map((name) => (
        <SpinnerPreview key={name} name={name} />
      ))}

      <h2>loaders.css Spinners</h2>
      <p>
        <small>(not all of these center here, but are easily centerable with flexbox)</small>
      </p>
      {loadersCssNames.map((name) => (
        <SpinnerPreview key={name} name={name} />
      ))}

      <h2>Spinner Options</h2>

      <Example code={'<Spinner name="wordpress" fadeIn="none" />'}>
        <Spinner name="wordpress" fadeIn="none" />
      </Example>

      <Example code={'<Spinner name="wordpress" fadeIn="quarter" />'}>
        <Spinner name="wordpress" fadeIn="quarter" />
      </Example>

      <Example code={'<Spinner name="wordpress" fadeIn="half" />'}>
        <Spinner name="wordpress" fadeIn="half" />
      </Example>

      <Example code={'<Spinner name="wordpress" overrideSpinnerClassName="my-class-to-override" />'}>
        <Spinner name="wordpress" overrideSpinnerClassName="my-class-to-override" />
      </Example>

      <Example code={'<Spinner name="wordpress" className="my-class" />'}>
        <Spinner name="wordpress" className="my-class" />
      </Example>

      <Example code={'<Spinner name="wordpress" color="green" />'}>
        <Spinner name="wordpress" color="green" />
      </Example>
    </main>
  );
}
