import React from 'react';
import { Button } from 'antd';
import { ComponentsStory } from 'components/ComponentsStory';
import { text, number } from '@storybook/addon-knobs';
import withPropsCombinations from 'react-storybook-addon-props-combinations';

ComponentsStory.add('Button', () => (
  <div>
    <Button />
    {withPropsCombinations(Button, {
      size: ['small', 'large'],
    })()}
  </div>
));
