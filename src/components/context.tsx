import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Item {
  label: string;
  onPress: () => void;
}

interface Props {
  items: Array<Item>;
  style: object;
  children: React.ReactNode;
}

// TODO: add proper positioning (pageX, within screen)
const Menu = ({ items, style, children }: Props) => {
  const ref = React.useRef<View>(null);
  const [showMenu, setMenu] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;

    if (showMenu && ref.current != null) {
      ref.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          if (isMounted) {
            setMenuPosition(pageY);
          }
        }
      );
    }

    return () => {
      isMounted = false;
    };
  }, [showMenu]);

  const onOpen = React.useCallback(() => setMenu(true), [setMenu]);
  const onClose = React.useCallback(() => setMenu(false), [setMenu]);
  const onSelect = React.useCallback(
    (item: Item) => {
      item.onPress();
      setMenu(false);
    },
    [setMenu]
  );

  return (
    <>
      <View ref={ref} collapsable={false}>
        <TouchableOpacity onPress={onOpen} style={style}>
          {children}
        </TouchableOpacity>
      </View>
      <Modal visible={showMenu} transparent>
        <TouchableWithoutFeedback onPress={onClose} accessible={false}>
          <View style={StyleSheet.absoluteFill} collapsable={false}>
            {menuPosition > 0 && (
              <View
                style={[
                  styles.menu,
                  {
                    top: menuPosition
                  }
                ]}>
                {items.map(item => (
                  <TouchableNativeFeedback
                    key={item.label}
                    background={TouchableNativeFeedback.Ripple('black', false)}
                    onPress={() => onSelect(item)}>
                    <Text style={styles.menuItem}>{item.label}</Text>
                  </TouchableNativeFeedback>
                ))}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    right: 0,
    zIndex: 1
  },
  menuItem: {
    padding: 10
  }
});

export default React.memo(Menu);
