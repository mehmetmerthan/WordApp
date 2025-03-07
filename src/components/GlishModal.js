import React from "react";
import { Dialog, Button } from "@rneui/themed";
import { View, StyleSheet } from "react-native";
import WebView from "react-native-webview";
export default function GlishModal({ word, setVisible, visible }) {
  function toggleDialog() {
    setVisible(!visible);
  }
  const formattedSentence = word.replace(/ /g, "%20");
  return (
    <Dialog isVisible={visible} overlayStyle={styles.dialog}>
      <View style={styles.webviewContainer}>
        <WebView
          source={{
            uri: `https://youglish.com/pronounce/${formattedSentence}/english`,
          }}
          style={styles.webview}
        />
      </View>
      <Dialog.Actions>
        <Button
          onPress={toggleDialog}
          title={"Close"}
          containerStyle={styles.closeButtonContainer}
        />
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialog: {
    width: "90%",
    height: "90%",
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  closeButtonContainer: {
    marginBottom: 20,
  },
});
