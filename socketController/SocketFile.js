
const onConnect = () => { }
const onTEst = (socket) => {
    console.log("onTEst", socket.id)
    socket.emit("test-response", "Emitted Succesfully")
}
const onDataRecieved = (socket, data) => {
    console.log(data, socket.id);
    socket.broadcast.emit("sensor-data-middleware", data);
}
function socketHandler(socket) {
    socket.on("connection", onConnect);
    socket.on("test", () => onTEst(socket))
    socket.on("data-recieved", (data) => onDataRecieved(socket, data))
}

module.exports = { socketHandler }