﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization;
namespace Entitie
{
    public class IniciarSesion
    {
        protected static IMongoClient client = new MongoClient("mongodb://general:123456c@ds225205.mlab.com:25205/social_cooking");
        protected static IMongoDatabase database = client.GetDatabase("social_cooking");

        public string ValidarUsuario(string correo)
        {
            var collection = database.GetCollection<BsonDocument>("Usuarios");
            var filter = Builders<BsonDocument>.Filter.Eq("Correo", correo);
            var result = collection.Find(filter).FirstOrDefault();
            //si result es igual a null, se crearia el usuario por defecto y retornaria nuevo.
            //en caso de que exista se mirar el siguiente comentario
            //creacion de objecto usuario para mandar lo que hay en el result al objeto usuario, alli se miraria que tipo de usuario es
            //por ultimo se retornaria el tipo de usuario.
            return "";
        }
    }
}