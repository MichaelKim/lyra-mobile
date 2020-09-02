import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';
import { Colors } from '../../constants';
import Header from './header';

type Props = {
  header?: string;
  visible: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
  onClose: () => void;
};

const FullModal = ({ header, visible, style, children, onClose }: Props) => {
  return (
    <Modal
      useNativeDriver
      propagateSwipe
      isVisible={visible}
      style={[styles.modal, style]}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}>
      <View style={styles.modalRoot}>
        {header && <Header title={header} onBack={onClose} />}
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0
  },
  modalRoot: {
    flex: 1,
    backgroundColor: Colors.screen
  }
});

export default FullModal;
