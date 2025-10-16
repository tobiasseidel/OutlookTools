#!/bin/bash

# Test-Skript für FastAPI (Bash-Version)
# Kann verwendet werden, wenn Python nicht verfügbar ist

API_URL="http://localhost:8000"

echo "=========================================="
echo "  FastAPI Test Suite (Bash)"
echo "=========================================="

# Farben
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "\n${YELLOW}Test 1: Health Check${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health)
if [ $RESPONSE -eq 200 ]; then
    echo -e "${GREEN}✅ Health Check erfolgreich!${NC}"
    curl -s $API_URL/health | python3 -m json.tool
else
    echo -e "${RED}❌ Health Check fehlgeschlagen! Status: $RESPONSE${NC}"
fi

# Test 2: Root Endpoint
echo -e "\n${YELLOW}Test 2: Root Endpoint${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/)
if [ $RESPONSE -eq 200 ]; then
    echo -e "${GREEN}✅ Root Endpoint erfolgreich!${NC}"
    curl -s $API_URL/ | python3 -m json.tool
else
    echo -e "${RED}❌ Root Endpoint fehlgeschlagen! Status: $RESPONSE${NC}"
fi

# Test 3: Test Connection
echo -e "\n${YELLOW}Test 3: Test Connection${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $API_URL/api/test \
    -H "Content-Type: application/json" \
    -d '{"test": "Hallo von Bash"}')
STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ $STATUS -eq 200 ]; then
    echo -e "${GREEN}✅ Test Connection erfolgreich!${NC}"
    echo "$BODY" | python3 -m json.tool
else
    echo -e "${RED}❌ Test Connection fehlgeschlagen! Status: $STATUS${NC}"
fi

# Test 4: Process Email
echo -e "\n${YELLOW}Test 4: Process Email${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $API_URL/api/process-email \
    -H "Content-Type: application/json" \
    -d '{
        "subject": "Test E-Mail",
        "from_address": "test@example.com",
        "body_preview": "Dies ist eine Test-E-Mail mit einigem Text zum Testen der API.",
        "received_time": "2025-10-15T12:00:00",
        "item_id": "TEST123"
    }')
STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ $STATUS -eq 200 ]; then
    echo -e "${GREEN}✅ Process Email erfolgreich!${NC}"
    echo "$BODY" | python3 -m json.tool
else
    echo -e "${RED}❌ Process Email fehlgeschlagen! Status: $STATUS${NC}"
fi

echo -e "\n=========================================="
echo "  Tests abgeschlossen"
echo "=========================================="
