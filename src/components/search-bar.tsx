import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

import { Search as SearchIcon } from '../icons';

import { Colors } from '../constants';
import { h3 } from '../styles';
import Suggestion from './suggest';

type Props = {
  initialValue?: string;
  onChange?: (value: string) => void;
  onEnter?: (value: string) => void;
  suggestions?: string[];
};

const Search = (props: Props) => {
  const [value, setValue] = React.useState(props.initialValue || '');
  const [focused, setFocused] = React.useState<boolean>(false);

  const onChange = (text: string) => {
    setValue(text);
    props.onChange?.(text);
  };

  const onEnter = () => props.onEnter?.(value);

  const onSelect = (suggest: string) => {
    setValue(suggest);
    props.onEnter?.(value);
  };

  return (
    <View style={styles.box}>
      <SearchIcon width={25} height={25} />
      <View style={styles.search}>
        <TextInput
          style={styles.textInput}
          placeholder="Search..."
          placeholderTextColor={Colors.placeholder}
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onEnter}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {focused && (
          <View>
            <View style={styles.suggest}>
              {props.suggestions?.map(s => (
                <Suggestion
                  key={s}
                  text={s}
                  search={value}
                  onPress={onSelect}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  search: {
    flex: 1
  },
  textInput: {
    ...h3,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 40,
    paddingLeft: 4,
    flex: 1
  },
  suggest: {
    position: 'absolute',
    zIndex: 1,
    width: '100%'
  }
});

export default Search;
