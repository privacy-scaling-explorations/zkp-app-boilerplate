# Zk app boilerplate

## Pre requisites

* Install rust and [circom2](https://docs.circom.io/getting-started/installation/)

## Getting started

1. Clone or fork this template repository.
    ```shell
    git clone https://github.com/wanseob/zkp-app-boilerplate
    ```
2. Install packages
    ```shell
    yarn
    ```
3. Build: this compiles the circuits and exports artifacts. Then compiles the contracts and generate typescript clients.
    ```shell
    yarn build
    ```
4. Run a demo app using a localhost private network.
    ```shell
    yarn demo
    ```

## Run tests
1. Test contracts
    ```shell
    yarn workspace contracts test
    ```

2. Test your circuits
    ```shell
    yarn workspace circuits test
    ```

3. Test your app
    ```shell
    yarn workspace app test
    ```


## Example: EdDSA signature rollup

Let's compress EdDSA signatures into one zk proof! Go to [tutorial!](./TUTORIAL.md)

To check the complete codes, visit the `tutorial` branch.
