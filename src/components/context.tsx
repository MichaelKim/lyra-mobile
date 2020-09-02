import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '../constants';

interface Item {
  label: string;
  onPress: () => void;
}

type Props = {
  items: Array<Item>;
  style: object;
  children: React.ReactNode;
};

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

  const onOpen = () => setMenu(true);
  const onClose = () => setMenu(false);
  const onSelect = (item: Item) => {
    item.onPress();
    setMenu(false);
  };

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
                  <Pressable
                    key={item.label}
                    android_ripple={{ color: Colors.ripple }}
                    onPress={() => onSelect(item)}>
                    <Text style={styles.menuItem}>{item.label}</Text>
                  </Pressable>
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
