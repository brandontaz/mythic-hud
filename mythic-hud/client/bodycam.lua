AddEventHandler("HUD:Client:BodycamToggled", function(state)
	SendNUIMessage({
		type = "BODYCAM_TOGGLED",
		data = {
			state = state
		}
	})
end)