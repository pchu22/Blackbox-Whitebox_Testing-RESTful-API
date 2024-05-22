module.exports = {
    "users":[
        {"id":1, "username":"alice", "password":"password123", role: "user"},
        {"id":2, "username":"bob", "password":"secret456", role: "user"},
        {"id":3, "username":"Pedro", "password":"$2b$10$vikR0.v19E65H.uJsx9zwe5hNVwonnaGIyiq7yRjevvpRxF3r0QHe", role: "admin"},
        {"id":22, "username":"NaoSei", "password":"$2b$10$vikR0.v19E65H.uJsx9zwe5hNVwonnaGIyiq7yRjevvpRxF3r0QHe", role: "user"},
    ],
    "orders":[
        {"id":101, "userId":1, "product":"Product A"},
        {"id":102, "userId":3, "product":"Product B"}
    ]
}