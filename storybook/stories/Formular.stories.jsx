import React from 'react';
import Formular from '@kiste/formular'



export default {
  title: 'Formular',
  component: Formular
};




const Template = (args) => <Formular>
  <input name="title"/>
  <select name="foo_bar">
    <option value="foo">foo</option>
    <option value="bar">bar</option>
  </select>
  <fieldset>
    <label htmlFor="content_1">Content_1</label>
    <textarea name="content_1"></textarea>
  </fieldset>
  <fieldset>
    <label htmlFor="content_2">Content_2</label>
    <textarea name="content_2"></textarea>
  </fieldset>
  <button type="submit">submit</button>
</Formular>;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};