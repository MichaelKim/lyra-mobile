import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

import { Search as SearchIcon } from '../icons';

import { Colors } from '../constants';
import { h3 } from '../styles';

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
    <View style={styles.box}>
      <SearchIcon width={25} height={25} />
      <TextInput
        style={styles.textInput}
        placeholder="Search..."
        placeholderTextColor={Colors.placeholder}
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onEnter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInput: {
    ...h3,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 32,
    paddingLeft: 4,
    flex: 1
  }
});

export default Search;
