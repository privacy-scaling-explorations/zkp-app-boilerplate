#!/bin/bash

trap "kill 0" EXIT

read -p "Enter your account address for demo : " address
read -p "Please note that you need to reset your metamask account when you have the nonce problem: [ok]"

yarn workspace contracts hardhat node & sleep 5
yarn workspace contracts hardhat set-demo-account --address $address --network localhost
export REACT_APP_MULTICALL_LOCALHOST=$(yarn workspace contracts hardhat deploy-multicall --network localhost)
export GENERATE_SOURCEMAP=false
yarn workspace app start

wait
