import React from "react";
import { Dialog, Button } from "@rneui/themed";
import { View, StyleSheet } from "react-native";
import WebView from "react-native-webview";
export default function WordDetailModal({
  word,
  setVisible,
  visible,
  translateTo = "eng",
}) {
  function toggleDialog() {
    setVisible(!visible);
  }
  const formattedSentence = word.replace(/ /g, "+");
  return (
    <Dialog isVisible={visible} overlayStyle={styles.dialog}>
      <View style={styles.webviewContainer}>
        <WebView
          source={{
            uri: `https://tatoeba.org/en/sentences/search?from=eng&query=${formattedSentence}&to=${translateTo}`,
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
    height: "80%",
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
