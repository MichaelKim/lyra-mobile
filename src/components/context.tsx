import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

interface Props {
  target: React.RefObject<View>;
  showMenu: boolean;
  items: Array<{ label: string; onPress: () => void }>;
  onCloseMenu: () => void;
}

// TODO: add proper positioning (pageX, within screen)
const Menu = ({ target, showMenu, items, onCloseMenu }: Props) => {
  const [menuPosition, setMenuPosition] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;

    if (showMenu && target.current != null) {
      target.current.measure(
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

  if (!showMenu || menuPosition === 0) {
    return null;
  }

  console.log('render menu', menuPosition);

  return (
    <Modal visible={showMenu} transparent>
      <TouchableWithoutFeedback onPress={onCloseMenu} accessible={false}>
        <View style={StyleSheet.absoluteFill} collapsable={false}>
          <View
            style={[
              styles.menu,
              {
                top: menuPosition
              }
            ]}>
            {items.map(item => (
              <RectButton key={item.label} onPress={item.onPress}>
                <Text style={styles.menuItem}>{item.label}</Text>
              </RectButton>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    backgroundColor: 'white',
    right: 0
  },
  menuItem: {
    padding: 10
  }
});

export default React.memo(Menu);
