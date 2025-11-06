#!/bin/bash

echo "🚀 Desplegando reglas de Firestore..."
echo ""
echo "IMPORTANTE: Asegúrate de tener Firebase CLI instalado"
echo "Si no lo tienes: npm install -g firebase-tools"
echo ""
echo "Desplegando..."
echo ""

# Desplegar solo las reglas de Firestore
firebase deploy --only firestore:rules --project bestwhip-67e0b

echo ""
echo "✅ Reglas desplegadas!"
echo ""
echo "Ahora espera 30 segundos y recarga tu aplicación"