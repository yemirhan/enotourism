import { Accordion } from '@mantine/core'
import React from 'react'

export const FAQ = () => {
  return (
    <Accordion defaultValue="customization">
    <Accordion.Item value="customization">
      <Accordion.Control>Question 1</Accordion.Control>
      <Accordion.Panel>answer</Accordion.Panel>
    </Accordion.Item>

    <Accordion.Item value="flexibility">
      <Accordion.Control>Question 2</Accordion.Control>
      <Accordion.Panel>answer</Accordion.Panel>
    </Accordion.Item>

    <Accordion.Item value="focus-ring">
      <Accordion.Control>Question 3</Accordion.Control>
      <Accordion.Panel>Answer</Accordion.Panel>
    </Accordion.Item>
  </Accordion>
  )
}
