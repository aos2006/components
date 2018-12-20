import React from 'react';
import uuid from 'uuid/v1';
import Button from '../Button';
import { ComponentsStory } from 'components/ComponentsStory';
import { text, number } from '@storybook/addon-knobs';
import withPropsCombinations from 'react-storybook-addon-props-combinations';

ComponentsStory.add('Button', () => (
  <div>
    <div style={{ display: 'none' }}>
      <Button>{100}</Button>
    </div>
    {withPropsCombinations(Button, {
      size: ['small', 'large'],
    })()}
  </div>
));
