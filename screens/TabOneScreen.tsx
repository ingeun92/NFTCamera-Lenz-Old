import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "../components/Themed";

import { Camera, CameraType } from "expo-camera";
import { useState, useEffect } from "react";

import axios from "axios";

export default function TabOneScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(CameraType.back);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const [metadata, setMetadata] = useState("");
  const [sendMetadata, setSendMetadata] = useState<any>(null);

  let camera: Camera;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const CameraPictureOptions = {
    exif: true,
  };

  const takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync(CameraPictureOptions);

    setPreviewVisible(true);
    setCapturedImage(photo);
    setMetadata(JSON.stringify(photo));
    setSendMetadata(photo);
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    setMetadata("");
    setSendMetadata(null);

    async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
  };

  const mintPicture = async () => {
    console.log(sendMetadata);
    try {
      const test = await axios.post(
        "https://test-besu.bsquarelab.com/besu/mintNFT",
        // "http://localhost:3000/besu/mintNFT",
        {
          name: "TestMint",
          data: sendMetadata,
          userPk:
            "004c011ef6840204c23e11da5476e621eb8b3c0e934585fa8a12d2b2b2606f00",
          contractAddress: "0x4473f5f742D927e39dDbF5cF50cA597295cD21E4",
        },
      );
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const CameraPreview = ({
    photo,
    metadata,
    retakePicture,
    mintPicture,
  }: any) => {
    return (
      <View style={styles.cameraPreview}>
        <ImageBackground
          source={{ uri: photo && photo.uri }}
          style={{
            flex: 1,
          }}
        >
          <ScrollView style={styles.metaInfo}>
            <Text style={{ color: "white", marginVertical: "5%" }}>
              {metadata}
            </Text>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonRetake}
              onPress={retakePicture}
            >
              <Text style={styles.text}>Re-Take</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonMint} onPress={mintPicture}>
              <Text style={styles.text}>Mint</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <>
      {previewVisible && capturedImage ? (
        <CameraPreview
          photo={capturedImage}
          metadata={metadata}
          retakePicture={retakePicture}
          mintPicture={mintPicture}
        ></CameraPreview>
      ) : (
        <Camera
          type={type}
          style={styles.container}
          ref={(ref: Camera) => {
            camera = ref;
          }}
        >
          <View style={styles.cameraView}>
            <View style={styles.buttonContainer}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={takePicture}
                  style={styles.buttonTake}
                />
              </View>
            </View>
          </View>
        </Camera>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  cameraPreview: {
    backgroundColor: "transparent",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  buttonRow: {
    alignSelf: "center",
    flex: 1,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  button: {
    flex: 0.5,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonRetake: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    borderRadius: 4,
  },
  buttonMint: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    borderRadius: 4,
  },
  buttonTake: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  metaInfo: {
    position: "absolute",
    backgroundColor: "rgba(59, 59, 59, 0.6)",
    width: "92%",
    height: "30%",
    color: "white",
    fontSize: 15,
    textAlign: "left",
    paddingStart: "5%",
    paddingEnd: "5%",
    marginStart: "4%",
    marginTop: "5%",
  },
});
