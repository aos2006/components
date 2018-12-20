import React from 'react';
import uuid from 'uuid/v1';
import Badge from './Badge';
import { ComponentsStory } from 'components/ComponentsStory';
import { text, number } from '@storybook/addon-knobs';
import withPropsCombinations from 'react-storybook-addon-props-combinations';

ComponentsStory.add('Badge', () => (
  <div>
    <div style={{ display: 'none' }}>
      <Badge>{1000}</Badge>
    </div>
    {withPropsCombinations(Badge, {
      children: [100, 1000],
    })()}
  </div>
));
