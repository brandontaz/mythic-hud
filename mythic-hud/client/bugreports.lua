local function EnableGUI(show)
    SetNuiFocus(show, show)
    SendNUIMessage({
		type = "SET_BUGS",
		data = {
			state = show,
		},
	})
end

RegisterNetEvent('BugReport:Client:CreateReport', function()
	EnableGUI(true)
end)

RegisterNUICallback('BugReport:Submit', function(data, cb)
	EnableGUI(false)
	TriggerServerEvent("BugReport:Server:SendReport", data)
  	cb('ok')
end)

RegisterNUICallback('BugReport:Close', function(data, cb)
	EnableGUI(false)
  	cb('ok')
end)