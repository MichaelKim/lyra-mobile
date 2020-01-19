import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Colors } from '../constants';

interface Props {
  initialValue?: string;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
}

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
      placeholderTextColor={Colors.placeholder}
      value={value}
      onChangeText={onChange}
      onSubmitEditing={onEnter}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    color: Colors.text,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  }
});

export default Search;
