pragma solidity 0.4.26;

import "../Snapshot/Snapshot.sol";
import "../Snapshot/DailyAndSnapshotable.sol";


contract TestSnapshot is
    Snapshot,
    DailyAndSnapshotable
{
    ////////////////////////
    // Mutable state
    ////////////////////////

    Values[] private _val;

    ////////////////////////
    // Constructor
    ////////////////////////
    constructor(uint256 start)
        DailyAndSnapshotable(start)
        public
    {}

    ////////////////////////
    // Public functions
    ////////////////////////}

    function setValue(uint256 x)
        public
    {
        setValue(_val, x);
    }

    function hasValue()
        public
        constant
        returns (bool)
    {
        return hasValue(_val);
    }

    function getValue(uint256 def)
        public
        constant
        returns (uint256)
    {
        return getValue(_val, def);
    }

    function hasValueAt(uint256 snapshot)
        public
        constant
        returns (bool)
    {
        return hasValueAt(_val, snapshot);
    }

    function getValueAt(uint256 snapshot, uint256 def)
        public
        constant
        returns (uint256)
    {
        return getValueAt(_val, snapshot, def);
    }

    //
    // Implements ISnapshotable
    //

    /// upper bound of series snapshotIds for which there's a value
    function currentSnapshotId()
        public
        constant
        returns (uint256)
    {
        return mCurrentSnapshotId();
    }
}
