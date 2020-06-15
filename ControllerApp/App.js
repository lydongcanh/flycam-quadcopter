import React, { useState, useEffect } from "react";
import { View, FlatList, Platform, PermissionsAndroid } from "react-native";
import { Text, Button, Card, ActivityIndicator, List, TextInput } from "react-native-paper";
import RNBluetoothClassic, { BTEvents, BTCharsets } from "react-native-bluetooth-classic";

export default function App() {
    const [devices, setDevices] = useState([]);
    const [sendValue, setSendValue] = useState("");
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
        } catch(e) {
            setIsConnected(false);
            console.log(e);
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

    async function send() {
        RNBluetoothClassic.write(sendValue);
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

    return (
        <View style={{ flex: 1, justifyContent: "space-between", margin: 12 }}>
            {renderDeviceList()}
            <View>
                <TextInput
                    label="Send value"
                    value={sendValue}
                    mode="outlined"
                    onChangeText={setSendValue}
                    style={{ marginVertical: 4 }}
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Button onPress={startScan}>Scan</Button>
                        <Button disabled={!isConnected} onPress={send}>Send</Button>
                        <Button disabled={!isConnected} onPress={disconnect}>Disconnect</Button>
                    </View>
                    <ActivityIndicator animating={isLoading} hidesWhenStopped={true} />
                </View>
            </View>
        </View>
    );
}