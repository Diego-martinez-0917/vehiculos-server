module.exports  = {
    getAllvehicles: "SELECT * FROM Vehiculos",
    createNewVehicle:"INSERT INTO Vehiculos (name,manufactureTime) VALUES (@name,@manufactureTime)",
    updateVehicleById:"UPDATE Vehiculos SET name = @name, manufactureTime = @manufactureTime where Id = @id",
    deleteVehicleById:"DELETE FROM Vehiculos where Id = @id",

    createNewOrder:"INSERT INTO Ordenes (idVehiculo, quantity, date) VALUES (@vehicle, @quantity, @date)",
    getOrdersReport:"SELECT idVehiculo, SUM(quantity) AS quantity from Ordenes where date = @date GROUP BY idVehiculo",
}