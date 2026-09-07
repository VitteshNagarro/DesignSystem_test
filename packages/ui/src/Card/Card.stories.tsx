import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/iVt954yRRUlVSlWU4HJygU/DesignSystem_Test?node-id=CARD_NODE_ID',
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['elevated', 'outlined', 'filled'] },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Outlined: Story = {
  args: {
    title: 'Card Title',
    description: 'A brief description of the card content.',
    children: 'Card body content goes here.',
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    title: 'Elevated Card',
    description: 'This card has a shadow.',
    children: 'Elevated card content.',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    title: 'Filled Card',
    description: 'This card has a filled background.',
    children: 'Filled card content.',
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Account Settings',
    description: 'Manage your account preferences.',
    children: 'Update your profile information and notification settings.',
    footer: (
      <div className="flex gap-spacing-sm justify-end">
        <Button variant="tertiary" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </div>
    ),
  },
};
