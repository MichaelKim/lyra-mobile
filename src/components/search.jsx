// @flow strict

import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import colors from '../colors';

type Props = {|
  +initialValue?: string,
  +onChange?: (value: string) => void,
  +onEnter?: (value: string) => void
|};

const Search = (props: Props) => {
  const [value, setValue] = React.useState(props.initialValue || '');

  const onChange = (text: string) => {
    setValue(text);
    props.onChange && props.onChange(text);
  };

  const onEnter = () => {
    props.onEnter && props.onEnter(value);
  };

  return (
    <TextInput
      style={styles.textInput}
      placeholder="Search..."
      placeholderTextColor={colors.placeholder}
      value={value}
      onChangeText={onChange}
      onSubmitEditing={onEnter}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    color: colors.text,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  }
});

export default Search;
