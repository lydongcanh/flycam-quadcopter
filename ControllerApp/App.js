import React, { useState, useEffect } from "react";
import { View, Platform, PermissionsAndroid, StyleSheet } from "react-native";
import { Button, Caption, Card, ActivityIndicator, List } from "react-native-paper";
import RNBluetoothClassic, { BTEvents, BTCharsets } from "react-native-bluetooth-classic";

export default function App() {

    const styles = StyleSheet.create({
        controlButtons: {
            width: "24%",
            height: "95%",
            alignSelf: "center",
            alignItems: "center",
            paddingTop: 15
        },
        controlTexts: {
            textAlignVertical: "center",
            alignSelf: "center",
            alignContent: "center",
            alignItems: "center"
        }
    });

    const [devices, setDevices] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [connectId, setConnectId] = useState();

    useEffect(() => {
        checkAndrdoiPermission();
    }, []);

    async function startScan() {
        setDevices([]);
        setisLoading(true);

        const list = await RNBluetoothClassic.list();
        setDevices(list);
        setisLoading(false);
    }

    async function connect(id) {
        try {
            setisLoading(true);
            const result = await RNBluetoothClassic.connect(id);
            setIsConnected(true);
            setConnectId(id);
            console.log(result);
        } catch (e) {
            setIsConnected(false);
            console.log(e);
            alert(e);
        } finally {
            setisLoading(false);
        }
    }

    async function disconnect() {
        const result = await RNBluetoothClassic.disconnect();
        setIsConnected(false);
        setConnectId();
        console.log(result);
    }

    function send(sendValue) {
        RNBluetoothClassic.write(sendValue.toString());
    }

    function checkAndrdoiPermission() {
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }
    }

    function renderDeviceList() {
        return (
            <List.Section title="Available devices">
                {devices.map(device => {
                    const borderWidth = device.id == connectId ? 1 : 0;
                    return (
                        <List.Item
                            disabled={isConnected}
                            onPress={async () => await connect(device.id)}
                            onLongPress={() => alert(JSON.stringify(device, null, 2))}
                            key={device.id}
                            title={device.name}
                            description={device.id}
                            style={{ borderWidth: borderWidth, borderColor: "green", borderRadius: 4 }}
                        />
                    )
                })}
            </List.Section>
        );
    }

    function renderControlButtons() {
        return (
            <Card style={{ padding: 4, backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                <View style={{ height: 60, flexDirection: "row", justifyContent: "space-between" }}>
                        <Card style={styles.controlButtons} onPress={() => send(0)}>
                            <Caption style={styles.controlTexts}>Go down</Caption>
                        </Card>
                        <Card style={styles.controlButtons} onPress={() => send(1)}>
                            <Caption style={styles.controlTexts}>Go up</Caption>
                        </Card>
                        <Card style={styles.controlButtons} onPress={() => send(2)}>
                            <Caption style={styles.controlTexts}>Go forward</Caption>
                        </Card>
                        <Card style={styles.controlButtons} onPress={() => send(3)}>
                            <Caption style={styles.controlTexts}>Go backward</Caption>
                        </Card>
                </View>
                <View style={{ height: 60, flexDirection: "row", justifyContent: "space-between" }}>
                        <Card style={styles.controlButtons} onPress={() => send(4)}>
                            <Caption style={styles.controlTexts}>Bend left</Caption>
                        </Card>
                        <Card style={styles.controlButtons} onPress={() => send(5)}>
                            <Caption style={styles.controlTexts}>Bend right</Caption>
                        </Card>
                        <Card style={styles.controlButtons} onPress={() => send(6)}>
                            <Caption style={styles.controlTexts}>Rotate left</Caption>
                        </Card>
                        <Card style={styles.controlButtons} onPress={() => send(7)}>
                            <Caption style={styles.controlTexts}>Rotate right</Caption>
                        </Card>
                </View>
            </Card>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: "space-between", margin: 12 }}>
            {renderDeviceList()}
            <View>
                {renderControlButtons()}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Button onPress={startScan}>Scan</Button>
                        <Button disabled={!isConnected} onPress={disconnect}>Disconnect</Button>
                    </View>
                    <ActivityIndicator animating={isLoading} hidesWhenStopped={true} />
                </View>
            </View>
        </View>
    );
}