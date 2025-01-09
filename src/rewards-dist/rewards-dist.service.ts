import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Web3Service } from 'nest-web3';

import rewardDistJson from '../abi/RewardDist';
import { EventTrackerService, IEvent } from '../event-tracker/event-tracker.service';
import stakingVaultJson from '../abi/StakingVault';
// import tokenJson from '../abi/Token';

const SYNC_INTERVAL = 10000;

@Injectable()
export class RewardDistService {
    private readonly logger = new Logger(RewardDistService.name);
    private client = this.web3Service.getClient('hmy');
    private gasLimit = 9721900;
    private accountAddress: string;

    private lastUpdateTime = '';
    private priceLastUpdateTimestamp = 0;
    private lastPrices = {};
    private lastPriceBits = '';
    private lastSuccessTx = '';
    private lastErrorTx = '';
    private lastError = '';

    private infoData: any = {};

    eventTrackerService: EventTrackerService;
    eventLogs: any[] = [];

    constructor(
        private configService: ConfigService,
        private readonly web3Service: Web3Service
    ) {
        this.client = this.web3Service.getClient('hmy');

        const account = this.client.eth.accounts.privateKeyToAccount('0x' + this.configService.get('keys.keeper'));

        this.client.eth.accounts.wallet.add(account);
        this.client.eth.defaultAccount = account.address;

        this.accountAddress = account.address;

        this.eventTrackerService = new EventTrackerService({
            contractAddress: this.configService.get('contracts.stakingVault'),
            contractAbi: stakingVaultJson.abi,
            web3: this.client,
            chain: 'hmy',
            getEventCallback: async (event: IEvent) => {
                if(event.name === "RewardsDeposited") {
                    //this.logger.log(event);

                    const timestamp = (await this.client.eth.getBlock(event.blockNumber)).timestamp;

                    this.eventLogs.push({
                        blockNumber: event.blockNumber,
                        transactionHash: event.transactionHash,
                        timestamp,
                        amount: event.returnValues?.amount,
                    })
                }

                return Promise.resolve();
            }
        })

        this.eventTrackerService.start(66974833);

        this.checkAndSendRewards();
    }

    execute = async () => {
        const rewardDistributorContract = new this.client.eth.Contract(
            rewardDistJson.abi as any,
            this.configService.get('contracts.rewardDistributor')
        );

        const latestBlock = await this.client.eth.getBlockNumber();
        const latestTimestamp = (await this.client.eth.getBlock(latestBlock)).timestamp;

        const epochDuration = await rewardDistributorContract.methods.epochDuration().call();
        const lastEpochStart = await rewardDistributorContract.methods.lastEpochStart().call();
        const rewardsPerEpoch = await rewardDistributorContract.methods.rewardsPerEpoch().call();

        // this.logger.log('latestBlock', latestBlock);
        // this.logger.log('latestTimestamp', latestTimestamp);
        // this.logger.log('epochDuration', epochDuration);
        // this.logger.log('lastEpochStart', lastEpochStart);
        // this.logger.log('rewardsPerEpoch', rewardsPerEpoch);

        this.infoData = {
            latestBlock, 
            latestTimestamp,
            epochDuration,
            lastEpochStart,
            rewardsPerEpoch
        }

        // this.logger.log(this.infoData);

        if ((Number(latestTimestamp) - lastEpochStart) > epochDuration) {
            this.logger.log('try distributeRewards');

            const tx = await rewardDistributorContract.methods
                .distributeRewards().send({
                    from: this.accountAddress,
                    gas: this.gasLimit,
                    gasPrice: 101000000000,
                });

            this.logger.log('distributeRewards', tx.transactionHash);

            this.lastSuccessTx = tx.transactionHash;
            this.lastUpdateTime = new Date().toISOString()
        } else {
            this.logger.log('skip distributeRewards');
        }
    }

    checkAndSendRewards = async () => {
        try {
            await this.execute();
        } catch (e) {
            this.logger.error('checkAndSendRewards', e);

            this.lastError = e.maessage || e;
        }

        setTimeout(() => this.checkAndSendRewards(), SYNC_INTERVAL);
    }

    info = () => {
        return {
            sync: this.infoData,
            lastUpdateTime: this.lastUpdateTime,
            lastSuccessTx: this.lastSuccessTx,
            lastErrorTx: this.lastErrorTx,
            lastError: this.lastError,
            contracts: {
                rewardDistributor: this.configService.get('contracts.rewardDistributor'),
                stakingVault: this.configService.get('contracts.stakingVault'),
                token: this.configService.get('contracts.token'),
            },
            SYNC_INTERVAL,
        }
    }

    list = () => { return this.eventLogs };

    eventsTrackerInfo = () => this.eventTrackerService.getInfo();
}
